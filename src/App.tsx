import useAPI from '#/lib/useAPI';

function App() {
    const { loading, error, data } = useAPI('http://localhost:8080/guilds');
    let JSXReturn;

    if (loading) {
        JSXReturn = <p>Please wait</p>;
    }

    if (error) {
        JSXReturn = <code>{JSON.stringify(error, null, 2)}</code>;
    }

    if (data) {
        JSXReturn = <code>{JSON.stringify(data, null, 2)}</code>;
    }

    return <>{JSXReturn}</>;
}

export default App;
