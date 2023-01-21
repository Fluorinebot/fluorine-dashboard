import { useFetch } from '../lib/useFetch';
import { APIGuild } from 'discord-api-types/v10';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const isUserAuth = useFetch<(APIGuild & { fluorine: boolean }) | { error: string }>('https://localhost:8080/guilds');

  if ((isUserAuth && 'error' in isUserAuth) || !isUserAuth) {
  }

  return <p>hi</p>;
}
