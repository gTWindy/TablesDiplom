const sendToServer = async (url, dataToServer) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Отправляем
            body: JSON.stringify(dataToServer),
        });

        if (!response.ok) {
            throw new Error(`Неудачный запрос: ${response.status}`);
        }

        // Если сервер возвращает 204 (No Content), возвращаем true
        if (response.status === 204) {
            return true;
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        return null;
    }
};

const getFromServer = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    };
}

export { sendToServer, getFromServer };