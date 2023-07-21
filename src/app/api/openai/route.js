import { OpenAIStream } from "@/app/utils/OpenAIStream";
import { intro } from "@/app/constants/introduction";



if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API Key')
}

export const runtime = 'edge'

export async function POST(request) {
    let { numberOfDrafts, numberOfWords, contentPillar, contentAngle, toneOfVoice, mainMessage, keywords } = await request.json()

    if (mainMessage === "") {
        let prompt = `${intro}
        Give a topic for Facebook marketing posts for Enouvo Space that revolves around the "${contentPillar}" pillar and approaches the "${contentAngle}" angle. The posts should have the ${toneOfVoice} tone and be around ${numberOfWords} words in length. Start immediately with the topic name and only the topic name: .`

        const payLoad = {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 1,
            frequency_penalty: 2,
            presence_penalty: 1,
            max_tokens: 20, // ~ 1125 words
            stream: true,
            n: 1,
        }

        const stream = await OpenAIStream(payLoad)
        const response = new Response(stream)

        const data = response.body
        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let responseText = "";
        while (!done) {
            const { value, done: doneReading } = await reader.read();

            done = doneReading;
            const chunkValue = decoder.decode(value);

            responseText += chunkValue;
        }

        mainMessage = responseText;
    }
    let firstPrompt = `${intro}
    Follow these instructions carefully and craft high-quality and original compelling Facebook marketing posts for Enouvo Space:
    """- Generate exactly ${numberOfDrafts} engaging Facebook marketing post(s) that revolves around the "${contentPillar}" pillar and approaches the "${contentAngle}" angle. The posts should have the ${toneOfVoice} tone and be around ${numberOfWords} words in length. The main message to convey is: "${mainMessage}".`

    let keyWordsPrompt = ""
    if (keywords != "") {
        keyWordsPrompt = `The following keywords should appear from 1 to 2 times in the posts: """${keywords}"""`
    }

    firstPrompt = `${firstPrompt} ${keyWordsPrompt}
    - Each post must be completely different from each others in both structure and vocabulary, with the similarity below 2%.
    - Write they formally, avoid using cheap trends."""`

    let finalPrompt = `${firstPrompt}
    Return your answer entirely in the form of a JSON object. The JSON has only one object named "posts" which is an array of the generated posts. Each element of that array will be a string with value as the corresponding post content. Make sure the returned JSON is valid to parse.`

    console.log(finalPrompt)

    const payLoad = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: finalPrompt }],
        temperature: 1,
        frequency_penalty: 2,
        presence_penalty: 1,
        max_tokens: 1500, // ~ 1125 words
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payLoad)
    return new Response(stream)
}