export default async function Home() {
  const testResponse = await fetch(
    "http://host.docker.internal/api/ticketing"
  ).then((res) => res.json());

  return (
    <main>
      <div>{JSON.stringify(testResponse, null, 4)}</div>
    </main>
  );
}
