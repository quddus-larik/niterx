import { getUserSession } from "./lib/sessions/authSession";
export default async function Home() {

  const UserSession = await getUserSession();
  console.log(UserSession);
  
  
  return (
    <main className="bg-slate-50">
     <h1>{JSON.stringify(UserSession)}</h1>
    </main>
  );
}
