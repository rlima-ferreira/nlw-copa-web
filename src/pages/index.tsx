import Image from 'next/image';
import { FormEvent } from 'react';
import api from '../services/api';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    try {
      ev.preventDefault();
      const formData = new FormData(ev.currentTarget);
      const form = Object.entries(formData);
      const { data } = await api.post('/pools', form);
      await navigator.clipboard.writeText(data.code);
      alert(
        'Bolão criado com sucesso, o código foi copiado para a área de transferência'
      );
      ev.currentTarget.reset();
    } catch (err) {
      alert('Falha ao criar o bolão, tente novamente');
    }
  }

  return (
    <div>
      <main className="max-w-[1124px] mx-auto grid grid-cols-2 items-center h-screen gap-28">
        <Image src={require('../assets/logo.svg')} alt="NLW Copa" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={require('../assets/users-avatar-example.png')} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>
        <form className="mt-10 flex gap-2" onSubmit={handleSubmit}>
          <input
            name="title"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm"
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 text-sm uppercase hover:bg-yellow-700"
          >
            Criar meu bolão
          </button>
        </form>
        <p className="text-sm text-gray-300 mt-4 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="flex justify-between items-center mt-10 pt-10 border-t border-gray-600 divide-x text-gray-100">
          <div className="flex-1 items-center gap-6">
            <Image src={require('../assets/icon-check.svg')} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text2xl">+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="h-14 w-px" />
          <div className="flex-1 items-center gap-6">
            <Image src={require('../assets/icon-check.svg')} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={require('../assets/app-nlw-copa-preview.png')}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const [poolCount, guessCount, userCount] = await Promise.all([
    (await api.get('/pools/count')).data.count,
    (await api.get('/guesses/count')).data.count,
    (await api.get('/users/count')).data.count,
  ]);

  return {
    props: {
      poolCount,
      guessCount,
      userCount,
    },
  };
}
