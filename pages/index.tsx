interface HomeProps {
  count: number;
}

export default function Home(props: HomeProps) {
  return <h1>Contagem {props.count}</h1>;
}

export async function getServerSideProps() {
  const response = await fetch('https://localhost:3000/pools/count');
  const data = await response.json();

  return {
    props: {
      count: data.count,
    },
  };
}
