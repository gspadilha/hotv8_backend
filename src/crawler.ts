import nodeFetch from 'node-fetch';
import cheerio, { load } from 'cheerio';

type CheerioRoot = ReturnType<typeof load>;

interface IResponse {
  index: number;
  imagemDestaque: string;
  nome: string;
  preco: string;
  descricao: string;
  imagens: Array<string>;
}

const buscarInformacoesPagina = async (url: string): Promise<CheerioRoot> => {
  const response = await nodeFetch(url);
  const data = await response.text();
  return cheerio.load(data);
};

const buscarCarros = async (local: string): Promise<Array<IResponse>> => {
  let $ = await buscarInformacoesPagina(`${process.env.SITE}${local}`);

  const veiculos: Array<IResponse> = [];
  const urls: Array<string> = [];
  let index = 1;

  $('.tour-minimal-inner').each((_, veiculo) => {
    urls.push(
      veiculo.attribs.onclick
        .split('href=')[1]
        .replace("'", '')
        .replace("'", ''),
    );
  });

  urls.filter((url: string) => url.trim() !== '');

  // eslint-disable-next-line no-restricted-syntax
  for await (const url of urls) {
    $ = await buscarInformacoesPagina(url);

    const primeiraSection = $('.section-first');

    const imagemDestaque = primeiraSection.find('img').attr('src');
    const nome = primeiraSection.find('h2').text();
    const preco = primeiraSection.find('h3').text();
    const descricao = primeiraSection
      .find('.tab-content')
      .text()
      .replace(/(\r\n|\n|\t|\r)/gm, '')
      .trim();
    const imagens: Array<string> = [];

    if (imagemDestaque !== undefined) {
      $('.section-fluid')
        .find('.thumbnail-classic')
        .each((_, image) => imagens.push(image.attribs.href));

      veiculos.push({
        index,
        imagemDestaque,
        nome,
        preco,
        descricao,
        imagens,
      });

      index += 1;
    }
  }

  return veiculos;
};

export default buscarCarros;
