export async function sendWhatsAppMessage(to: string, text: string) {
    const url = process.env.WASENDER_MCP_URL;
    const token = process.env.WASENDER_MCP_TOKEN;
    const sessionId = process.env.WASENDER_SESSION_ID;

    if (!url || !token || !sessionId) {
        console.error("[WASENDER] Missing configuration", { url: !!url, token: !!token, sessionId: !!sessionId });
        return { success: false, error: "Missing configuration" };
    }

    try {
        // Cleaning phone number (remove +, spaces, etc.)
        const cleanTo = to.replace(/\D/g, '');
        const targetUrl = url;

        console.log(`[WASENDER] Sending message to ${cleanTo} via ${targetUrl}...`);

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "tools/call",
                params: {
                    name: "send_text_message",
                    arguments: {
                        session_id: sessionId,
                        to: cleanTo,
                        text: text
                    }
                },
                id: "1"
            })
        });

        console.log(`[WASENDER] Response status: ${response.status}`);
        
        let result;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            result = { error: await response.text() };
        }
        
        console.log(`[WASENDER] Response body:`, JSON.stringify(result));

        if (!response.ok) {
            console.error("[WASENDER] API Error:", result);
            return { success: false, error: result };
        }

        console.log(`[WASENDER] Message sent successfully to ${cleanTo}`);
        return { success: true, data: result };

    } catch (error) {
        console.error("[WASENDER] Network/Server Error:", error);
        return { success: false, error: error };
    }
}
