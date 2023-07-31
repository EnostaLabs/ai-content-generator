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
        messages: [{ role: 'user', content: prompt }],
        temperature: 1,
        frequency_penalty: 2,
        presence_penalty: 1,
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
            prompt = `${intro}
            I want you to act as a copywriter with 10 years of experience.
            Give me ${numberOfDrafts} excited minigame or contest ideas to make target audience interact with Enouvo Space Facebook fanpage. Return only the main idea(s) directly, do not include any explain.`
            mainMessage = await getIdea(prompt);
        }
        firstPrompt = `${intro}
        ${formulas}
        Follow these instructions carefully and craft high-quality and original compelling Facebook marketing posts for Enouvo Space:
        """
        - Based on the minigame ideas: """${mainMessage}""", generate exactly ${numberOfDrafts} engaging Facebook marketing post(s).
        - The post(s) should have the ${toneOfVoice} tone and each post must be ${numberOfWords} words in length.
        - You must consider and pick some the best formulas from the aforementioned formulas that fit best for engagement minigame post.
        `
    }

    if (contentAngle === "local experiencing") {
        if (mainMessage === "") {
            prompt = `I want you to act as a copywriter with 10 years of experience.
            Give me ${numberOfDrafts} idea(s) about habits of Danang people or Vietnamese people, Danang or Vietnam attractions or cuisines, Vietnam festivals at this time.
            Return only the main idea(s) directly, do not include any explain.`
            mainMessage = await getIdea(prompt);
        }
        firstPrompt = `${intro}
        ${formulas}
        Follow these instructions carefully and craft high-quality and original compelling Facebook marketing posts for Enouvo Space:
        """
        - Based on the local experiencing idea: """${mainMessage}""", generate exactly ${numberOfDrafts} engaging Facebook marketing post(s).
        - The post(s) should have the ${toneOfVoice} tone and each post must be ${numberOfWords} words in length.
        - You must consider and pick some the best formulas from the aforementioned formulas that fit best for engagement local experiencing post.
        `

    }
    if (contentAngle === "insightful coworking knowledge"){
        if (mainMessage === ""){
            prompt = `I want you to act as a copywriter with 10 years of experience.
            Give me ${numberOfDrafts} idea(s) about co-working knowledge like tips and tricks, ebooks, short facts, etc. 
            Return only the main idea(s) directly, do not include any explain.`
            mainMessage = await getIdea(prompt);
        }
        firstPrompt = `${intro}
        ${formulas}
        Follow these instructions carefully and craft high-quality and original compelling Facebook marketing posts for Enouvo Space:
        """
        - Based on the folowing insightful knowledge idea(s): """${mainMessage}""", generate exactly ${numberOfDrafts} engaging Facebook marketing post(s).
        - The post(s) should have the ${toneOfVoice} tone and each post must be ${numberOfWords} words in length.
        - You must consider and pick some of the best formulas from the aforementioned formulas that fit best for customer education post.
        `
    }
    else {
        if (mainMessage === "") {
            prompt = `${intro}
            I want you to act as a copywriter with 10 years of experience.
            Give me ${numberOfDrafts} idea(s) for Facebook marketing posts for Enouvo Space that revolves around the "${contentPillar}" pillar and approaches the "${contentAngle}" angle.
            Return only the main idea(s) directly, do not include any explain.`
            mainMessage = await getIdea(prompt);
        }
        firstPrompt = `${intro}
            ${formulas}
            Follow these instructions carefully and craft high-quality and original compelling Facebook marketing posts for Enouvo Space:
            """
            - I want you to write ${numberOfDrafts} Facebook marketing post(s) that revolves around the "${contentPillar}" pillar and approaches the "${contentAngle}" angle, based on these idea: """"${mainMessage}""". 
            - The post(s) should have the ${toneOfVoice} tone and each post must be ${numberOfWords} words in length.
            - You must consider and pick some the best formulas from the aforementioned formulas that fit the required content pillar, content angle, tone of voice, and main idea.`
    }

    let keyWordsPrompt = ""
    if (keywords != "") {
        keyWordsPrompt = `- The following keywords should appear from 1 to 2 times in the posts: """${keywords}"""`
    }

    firstPrompt = `${firstPrompt} ${keyWordsPrompt}
    - Use English only.
    - All posts must has its own headline.
    - Do not include any icon or special character.
    - You must write each post with different formulas. Each post must be completely different from each others in both structure and vocabulary, with the similarity below 2%.
    - Write they formally, avoid using cheap trends."""`

    const requestedOutputStructure = [
        {
            heading: 'The headline',
            content: 'The post content',
        }
    ]

    let finalPrompt = `${firstPrompt}
    Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation.
    ${JSON.stringify(requestedOutputStructure, null, 2)}`

    console.log(finalPrompt)

    const payLoad = {
        model: 'gpt-3.5-turbo-16k',
        messages: [{ role: 'user', content: finalPrompt }],
        temperature: 1,
        frequency_penalty: 2,
        presence_penalty: 1,
        max_tokens: 10000,
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payLoad)
    return new Response(stream)
}