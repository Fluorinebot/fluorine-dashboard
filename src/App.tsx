import { useEffect, useState } from 'react';
import './App.css';

function App() {  
  const [guilds, setGuilds] = useState<any>({});

  useEffect(() => {
    async function effect() {
      const val = await fetch('http://localhost:8080/guilds', { method: 'GET' });
      const obj = await val.text()
      console.log(obj)
      setGuilds(obj)
    }

    effect()
  }, [])

  return (
    <>
    <a href="https://discord.com/api/oauth2/authorize?client_id=1056998560538824744&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth&response_type=code&scope=identify%20guilds">the fuck</a>
    <br></br>
    <code>{`${guilds}`}</code>
    </>
  );
}

export default App;
