import { OpenAIStream } from "@/app/utils/OpenAIStream";
import { intro } from "@/app/constants/introduction";
import { formulas } from "@/app/constants/formulas";



if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API Key')
}

export const runtime = 'edge'

async function getIdea(prompt) {
    const payLoad = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: 'You are a copywriter with 10 years of experience.' },
        { role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
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
    return responseText;
}

export async function POST(request) {
    let { numberOfDrafts, numberOfWords, contentPillar, contentAngle, toneOfVoice, mainMessage, keywords } = await request.json()
    let prompt = ""
    let firstPrompt = ""
    if (contentAngle === "minigame or contest") {
        if (mainMessage === "") {
            prompt = `
            Give me exactly ${numberOfDrafts} excited minigame or contest idea to make target audience interact with Enouvo Space Facebook fanpage. Return only the main idea directly, do not include any explain.`
            mainMessage = await getIdea(prompt);
        }
        firstPrompt = `
        ${formulas}
        Follow these instructions carefully and craft high-quality and original compelling Facebook marketing posts for Enouvo Space:
        """
        - Based on the minigame idea: """${mainMessage}""", generate exactly ${numberOfDrafts} engaging Facebook marketing post.
        - The game rule must be written in form of bullet point lists.
        - The post should have the ${toneOfVoice} tone and each post must be approximately ${numberOfWords} words in length.
        - You must consider and pick some formulas from the aforementioned formulas that fit best for engagement minigame post.
        `
    }

    if (contentAngle === "local experiencing") {
        if (mainMessage === "") {
            prompt = `
            Give me exactly ${numberOfDrafts} idea about Da Nang or Vietnam local experiencing.
            Return only the main idea directly, do not include any explain.`
            mainMessage = await getIdea(prompt);
        }
        firstPrompt = `
        ${formulas}
        Follow these instructions carefully and craft high-quality and original compelling Facebook marketing posts for Enouvo Space:
        """
        - Based on the local experiencing idea: """${mainMessage}""", generate exactly ${numberOfDrafts} engaging Facebook marketing post.
        - The post should have the ${toneOfVoice} tone and each post must be approximately ${numberOfWords} words in length.
        - You must consider and pick some formulas from the aforementioned formulas that fit best for engagement local experiencing post.
        `

    }
    if (contentAngle === "insightful coworking knowledge") {
        if (mainMessage === "") {
            prompt = `
            Give me exactly ${numberOfDrafts} idea about co-working knowledge like tips and tricks, ebooks, short facts, etc. 
            Return only the main idea directly, do not include any explain.`
            mainMessage = await getIdea(prompt);
        }
        firstPrompt = `
        ${formulas}
        Follow these instructions carefully and craft high-quality and original compelling Facebook marketing posts for Enouvo Space:
        """
        - Based on the folowing insightful knowledge idea: """${mainMessage}""", generate exactly ${numberOfDrafts} engaging Facebook marketing post(s).
        - The post(s) should have the ${toneOfVoice} tone and each post must be ${numberOfWords} words in length.
        - You must consider and pick some of the best formulas from the aforementioned formulas that fit best for customer education post.
        `
    }
    else {
        if (mainMessage === "") {
            prompt = `$
            Give me ${numberOfDrafts} idea for Facebook marketing posts for Enouvo Space that revolves around the "${contentPillar}" pillar and approaches the "${contentAngle}" angle.
            Return only the main idea directly, do not include any explain.`
            mainMessage = await getIdea(prompt);
        }
        firstPrompt = `
            ${formulas}
            Follow these instructions carefully and craft high-quality and original compelling Facebook marketing posts for Enouvo Space:
            """
            - I want you to write ${numberOfDrafts} Facebook marketing post that revolves around the "${contentPillar}" pillar and approaches the "${contentAngle}" angle, based on these idea: """"${mainMessage}""". 
            - The post should have the ${toneOfVoice} tone and each post must be ${numberOfWords} words in length.
            - You must consider and pick some the best formulas from the aforementioned formulas that fit the required content pillar, content angle, tone of voice, and main idea.`
    }

    let keyWordsPrompt = ""
    if (keywords != "") {
        keyWordsPrompt = `- The following keywords should appear from 1 to 2 times in the posts: """${keywords}"""`
    }

    firstPrompt = `${firstPrompt} ${keyWordsPrompt}
    - Use English only.
    - All posts must has its own headline.
    - You must write each post with different formulas. Each post must be completely different from each others in both structure and vocabulary, with the similarity below 2%."""`

    let finalPrompt = `${firstPrompt}`
    console.log(finalPrompt)

    const payLoad = {
        model: 'gpt-3.5-turbo-16k',
        messages: [{ role: 'system', content: 'You are a copywriter with 10 years of experience.' }, { role: "system", content: "Output only valid JSON, format: {'posts': [{'headline': 'the headline', 'content': 'the content'}]}" }, { role: 'user', content: firstPrompt }],
        temperature: 0.7,
        max_tokens: 10000,
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payLoad)
    return new Response(stream)
}