import { sendMessage } from './src/lib/ai/actions';
import { ChatState, ChatSlots } from './src/lib/ai/state';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runTurn(turnName: string, history: any[], currentState: ChatState, currentSlots: ChatSlots) {
    console.log(`\n--- ${turnName}: State: ${currentState}, Slots: ${JSON.stringify(currentSlots)} ---`);
    // @ts-ignore
    const stream = await sendMessage(history, currentState, currentSlots);

    let state = currentState;
    let slots = currentSlots;
    let fullResponse = "";

    for await (const chunk of stream) {
        try {
            // @ts-ignore
            const parsed = JSON.parse(chunk);
            if (parsed.type === 'text-delta') {
                process.stdout.write(parsed.content);
                fullResponse += parsed.content;
            } else if (parsed.type === 'state-update') {
                state = parsed.state;
                slots = parsed.slots;
                console.log(`\n\n[NEW STATE]: ${state}`);
                console.log(`[EXTRACTED SLOTS]: ${JSON.stringify(slots, null, 2)}`);
            }
        } catch (e) {
            console.error("\nParse Error on chunk:", chunk);
        }
    }

    return { state, slots, modelResponse: fullResponse };
}

async function verifyFlow() {
    let state: ChatState = 'ASK_NAME';
    let slots: ChatSlots = {};
    const history: any[] = [{ role: 'model', content: 'Para empezar, ¿cómo te llamas?' }];

    // Turn 1
    history.push({ role: 'user', content: 'Soy Domingo y di 0.75 en Madrid. Me pararon en un control.' });
    const t1 = await runTurn('Turn 1 (Provide Name + City + Rate + Incident)', history, state, slots);
    state = t1.state;
    slots = t1.slots;
    history.push({ role: 'model', content: t1.modelResponse });

    // Turn 2
    history.push({ role: 'user', content: 'No tengo antecedentes penales.' });
    const t2 = await runTurn('Turn 2 (Provide Priors)', history, state, slots);
    state = t2.state;
    slots = t2.slots;
    history.push({ role: 'model', content: t2.modelResponse });
}

verifyFlow();
