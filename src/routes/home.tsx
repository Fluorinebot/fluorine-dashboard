import { useFetch } from '../lib/useFetch';
import { APIGuild } from 'discord-api-types/v10';
import { CLIENT_ID, BASE_URI, REDIRECT_URI } from '../lib/constants';

export default function Home() {
  const isUserAuth = useFetch<APIGuild & { fluorine: boolean }>(`${BASE_URI}/guilds`, { method: 'GET' });

  return (
    <>
      {!isUserAuth && <p>please wait..</p>}
      {isUserAuth && 'error' in isUserAuth && (
        <a
          href={`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20guilds`}
        >
          you need to authorize, {isUserAuth.error}
        </a>
      )}
      <p>hi</p>
    </>
  );
}
