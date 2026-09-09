# StoryCam 

Desenvolvido por **Pedro Barbier**.

Aplicativo mobile desenvolvido em **React Native** com **Expo**, com interface inspirada nos "Stories" de redes sociais. Permite:

- Abrir a câmera nativa do dispositivo e tirar uma foto;
- Salvar a foto capturada diretamente na galeria do celular;
- Selecionar uma foto já existente na galeria (como se fosse escolher uma imagem para postar);
- Visualizar a foto em tela cheia, no estilo "story", com opções de salvar, descartar ou tirar outra;
- Consultar o status das permissões de câmera e galeria a qualquer momento.

## Tecnologias

- [Expo](https://expo.dev/)
- [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) — abrir câmera e galeria
- [expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/) — salvar foto na galeria
- [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) — efeitos visuais
- `@expo/vector-icons` — ícones

## Permissões utilizadas

O app solicita duas permissões principais, conforme exigido:

1. **Câmera** (`CAMERA` / `NSCameraUsageDescription`) — necessária para tirar fotos.
2. **Fotos / Galeria** (`READ_MEDIA_IMAGES`, `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`) — necessária para ler fotos existentes e para salvar a foto tirada.

As permissões são solicitadas em tempo de execução (runtime), na hora em que o usuário toca em cada botão, e o app trata o caso de recusa mostrando um alerta explicativo.

## Como rodar o projeto

```bash
# 1. Instale as dependências
npm install

# 2. Rode o projeto
npx expo start

# Caso tenha problemas de rede/firewall (ex: Wi-Fi de faculdade):
npx expo start --tunnel
```

Abra o app **Expo Go** no seu celular (Android ou iOS) e escaneie o QR Code exibido no terminal/navegador.

## Estrutura do projeto

```
storycam-app/
├── App.js          # Tela principal e lógica do app
├── app.json        # Configurações do Expo e permissões
├── package.json    # Dependências
└── assets/         # Ícones e imagens (adicione seu icon.png e splash.png aqui)
```

## Tela principal

A tela inicial conta com 3 botões:

1. **Tirar Foto** — abre a câmera do dispositivo.
2. **Escolher da Galeria** — abre o seletor de imagens do dispositivo.
3. **Ver Permissões** — exibe um resumo do status atual das permissões concedidas.

Após tirar ou escolher uma foto, o app exibe uma tela em estilo "story" (foto em tela cheia) com as opções **Salvar**, **Descartar** e **Nova foto**.
