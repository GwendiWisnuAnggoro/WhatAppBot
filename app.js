const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const linkToQr = require('qrcode');
const fs = require('fs');
const translate = require('translate-google');
const weather = require('weather-js');


const client = new Client();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// TextToAksaraJawa("Ibu");
// weatherr("Jakarta")

client.on('ready', () => {
  console.log('BOT SIAP DI GUNAKAN!!');

});


client.on('message', async (msg) => {
  if (msg.body.toLowerCase() === '$menu') {
    await client.sendMessage(msg.from, `Menu: 
    \n1. $menu *untuk menampilkan menu yang ada*
    \n2. $linktoqr [link] *digunakan untuk mengubah link ke qr*
    \n3. $cari [pertanyaan] *digunakan untuk menjawab pertanyaan anda*
    \n4. [kirim gambar/link] $imgtosticker *untuk mengubah gambar ke sticker*
    \n5. $translate from [dari bahasa] to [ke bahasa] text [text yang di terjemahkan] *dirgunakan untuk menerjemahkan text*
    \n6. $cuaca [kota] *digunakan untuk memberikan ramlan cuaca*`);


  } else if (msg.body.startsWith('$linktoqr ')) {
    linktoqr(msg);
  } else if(msg.body.startsWith("$cari ")) {
    Cari(msg);
  } else if (msg.body.startsWith("$imgtosticker")) {
    imagetosticker(msg);
  } else if (msg.body.startsWith("$translate ")){
    translates(msg);
  } else if(msg.body.startsWith("$cuaca ")){
    weatherr(msg);
  }
  
});


const linktoqr = msg => {
  const link = msg.body.slice(10);
  const qrPath = './qr.png';
  linkToQr.toFile(qrPath, link, (err) => {
    if (err) {
      console.error(err);
      client.sendMessage(msg.from, 'Maaf, QR gagal di buat. Silahkan coba lagi!');
      return;
    }

    const media = MessageMedia.fromFilePath(qrPath);
    client.sendMessage(msg.from, media, { caption: 'QR code dari link ' + link });
    fs.unlinkSync(qrPath);
  });
}

const Cari = msg => {
  let cari = msg.body.replace("$cari", "").trim();
    cari ? client.sendMessage(msg.from, "Mencari...") : console.log("OK");
    fetch('https://admin11.pythonanywhere.com/gpt3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: cari.toLowerCase() })
  })
    .then(res => res.json())
    .then(data => {
      msg.reply(data);
    fetch('https://admin11.pythonanywhere.com/gpt3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: cari.toLowerCase() })
    })
    .catch(error => {
      console.error(error);
    });
  })
}

const imagetosticker = async msg => {
  let attachmentData;
  if (msg.hasMedia && msg.type === "image") {
    msg.reply('Sedang Membuat Sticker...');
    attachmentData = await msg.downloadMedia();
  } else if (msg.quotedMsg && msg.quotedMsg.hasMedia && msg.quotedMsg.type === "image") {
    msg.reply('Sedang Membuat Sticker...');
    attachmentData = await msg.quotedMsg.downloadMedia();
  } else {
    msg.reply("Tolong Kirim Gambar yang benar!!");
    return;
  }
  const imageBase64 = attachmentData.data.toString("base64");
  const sticker = await client.sendMessage(msg.from, new MessageMedia("image/png", imageBase64), {
      sendMediaAsSticker: true
  });
};


function translates(msg){
  let string = msg.body.toLowerCase();
  string.replace("$translate", "")
  const match = string.match(/from\s(.*)\sto\s(.*)\stext\s{([^}]+)}/) || string.match(/dari\s(.*)\ske\s(.*)\skata\s{([^}]+)}/) || string.match(/dari (.*) ke (.*) kata (.*)/) || string.match(/from (.*) to (.*) text (.*)/);

  if (match) {
    const from = match[1];
    const to = match[2];
    const text = match[3];
    
    console.log(from); 
    console.log(to);    
    console.log(text); 
    let dari = bahasaIndo(from).toString(),
    ke = bahasaIndo(to).toString();
    if(dari && ke){
      translate(text.toString(), {from: dari, to: ke})
      .then(res => {
        msg.reply(res);
      })
      .catch(err => {
        console.error(err);
        if (err) {
          const regex = /The language '(.*)' is not supported/;
          const match = err.message.match(regex);
          if (match) {
            const unsupportedLanguage = match[1];
            msg.reply(`Maaf, bahasa ${unsupportedLanguage} tidak didukung!`);
          } else {
            console.error(err);
            msg.reply("Terjadi kesalahan, silakan coba lagi.");
          }
        }
      });   
    } else {
      msg.reply("Format tidak valid !!");
    }
    }
}

function bahasaIndo(bahasa){
  let code = '';
  switch (bahasa.toLowerCase()) {
    case 'afrikaans':
    case 'afrikaans':
    case 'afrikaan':
    case 'afrika':
      code = 'af';
      break;
    case 'albanian':
    case 'albania':
      code = 'sq';
      break;
    case 'arabic':
    case 'arab':
      code = 'ar';
      break;
    case 'armenian':
    case 'armenia':
      code = 'hy';
      break;
    case 'azerbaijani':
    case 'azerbaijan':
      code = 'az';
      break;
    case 'basque':
    case 'basque':
      code = 'eu';
      break;
    case 'belarusian':
    case 'belarusia':
      code = 'be';
      break;
    case 'bengali':
    case 'bengali':
      code = 'bn';
      break;
    case 'bosnian':
    case 'bosnia':
      code = 'bs';
      break;
    case 'bulgarian':
    case 'bulgaria':
      code = 'bg';
      break;
    case 'catalan':
    case 'katalan':
      code = 'ca';
      break;
    case 'cebuano':
    case 'cebuano':
      code = 'ceb';
      break;
    case 'chichewa':
    case 'chichewa':
      code = 'ny';
      break;
    case 'chinese traditional':
    case 'cina':
    case 'mandarin':
    case 'chinese':
    case 'china':
    case 'cina tradisional':
    case 'chinese':
    case 'china tradisional':
      code = 'zh-tw';
      break;
    case 'corsican':
    case 'korsika':
      code = 'co';
      break;
    case 'croatian':
    case 'kroasia':
      code = 'hr';
      break;
    case 'czech':
    case 'ceko':
      code = 'cs';
      break;
    case 'danish':
    case 'denmark':
      code = 'da';
      break;
    case 'dutch':
    case 'belanda':
      code = 'nl';
      break;
    case 'english':
    case 'inggris':
      code = 'en';
      break;
    case 'esperanto':
    case 'esperanto':
      code = 'eo';
      break;
    case 'estonian':
    case 'estonia':
      code = 'et';
      break;
    case 'filipino':
    case 'filipina':
      code = 'tl';
      break;
    case 'finnish':
    case 'finlandia':
      code = 'fi';
      break;
    case 'french':
    case 'perancis':
    case 'prancis':
      code = 'fr';
      break;
    case 'frisian':
    case 'frisia':
      code = 'fy';
      break;
    case 'galician':
    case 'galicia':
      code = 'gl';
      break;
    case 'georgian':
    case 'georgia':
      code = 'ka';
      break;
    case 'german':
    case 'jerman':
      code = 'de';
      break;
    case 'greek':
    case 'yunani':
      code = 'el';
      break;
    case 'gujarati':
    case 'gujarati':
      code = 'gu';
      break;
    case 'haitian creole':
    case 'haiti kreyol':
      code = 'ht';
      break;
    case 'hausa':
    case 'hausa':
      code = 'ha';
      break;
    case 'hawaiian':
    case 'hawai':
    case 'hawaii':
      code = 'haw';
      break;
    case 'hebrew':
    case 'ibrani':
      code = 'iw';
      break;
    case 'hindi':
    case 'india':
      code = 'hi';
      break;
    case 'hmong':
    case 'hmong':
      code = 'hmn';
      break;
    case 'hungarian':
    case 'hungaria':
      code = 'hu';
      break;
    case 'icelandic':
    case 'islandia':
      code = 'is';
      break;
    case 'igbo':
    case 'igbo':
      code = 'ig';
      break;
    case 'indonesian':
    case 'indonesia':
      code = 'id';
      break;
    case 'irish':
    case 'irlandia':
      code = 'ga';
      break;
    case 'italian':
    case 'italia':
      code = 'it';
      break;
    case 'japanese':
    case 'jepang':
      code = 'ja';
      break;
    case 'javanese':
    case 'jawa':
      code = 'jv';
      break;
    case 'kannada':
    case 'kanada':
      code = 'kn';
      break;
    case 'kazakh':
    case 'kazakh':
      code = 'kk';
      break;
    case 'khmer':
    case 'khmer':
      code = 'km';
      break;
    case 'korean':
    case 'korea':
      code = 'ko';
      break;
    case 'kurdish':
    case 'kurdi':
      code = 'ku';
      break;
    case 'kyrgyz':
    case 'kyrgyz':
      code = 'ky';
      break;
    case 'lao':
    case 'lao':
      code = 'lo';
      break;
    case 'latin':
    case 'latin':
      code = 'la';
      break;
    case 'latvian':
    case 'latvia':
      code = 'lv';
      break;
    case 'lithuanian':
    case 'lituania':
      code = 'lt';
      break;
    case 'luxembourgish':
    case 'luxembourgish':
      code = 'lb';
      break;
    case 'macedonian':
    case 'makedonia':
      code = 'mk';
      break;
    case 'malagasy':
    case 'malagasi':
      code = 'mg';
      break;
    case 'malay':
    case 'melayu':
    case 'malaysia':
      code = 'ms';
      break;
    case 'malayalam':
    case 'malayalam':
      code = 'ml';
      break;
    case 'maltese':
    case 'malta':
      code = 'mt';
      break;
    case 'maori':
    case 'maori':
      code = 'mi';
      break;
    case 'marathi':
    case 'marathi':
      code = 'mr';
      break;
    case 'mongolian':
    case 'mongolia':
      code = 'mn';
      break;
    case 'myanmar':
    case 'mianmar':
      code = 'my';
      break;
    case 'nepali':
    case 'nepal':
      code = 'ne';
      break;
    case 'norwegian':
    case 'norwegia':
      code = 'no';
      break;
    case 'odia':
    case 'odia':
      code = 'or';
      break;
    case 'pashto':
    case 'pashto':
      code = 'ps';
      break;
    case 'persian':
    case 'persia':
      code = 'fa';
      break;
    case 'polish':
    case 'polandia':
      code = 'pl';
      break;
    case 'portuguese':
    case 'portugis':
      code = 'pt';
      break;
    case 'punjabi':
    case 'punjabi':
      code = 'pa';
      break;
    case 'romanian':
    case 'roma':
    case 'rumania':
      code = 'ro';
      break;
    case 'russian':
    case 'rusia':
    case 'russia':
      code = 'ru';
      break;
    case 'samoan':
    case 'samoa':
      code = 'sm';
      break;
    case 'scots gaelic':
    case 'scots gaelic':
      code = 'gd';
      break;
    case 'serbian':
    case 'serbia':
      code = 'sr';
      break;
    case 'sesotho':
    case 'sesotho':
      code = 'st';
      break;
    case 'shona':
    case 'shona':
      code = 'sn';
      break;
    case 'sindhi':
    case 'sindhi':
      code = 'sd';
      break;
    case 'sinhala':
    case 'sinhala':
      code = 'si';
      break;
    case 'slovak':
    case 'slowakia':
      code = 'sk';
      break;
    case 'slovenian':
    case 'slovenia':
      code = 'sl';
      break;
    case 'somali':
    case 'somalia':
      code = 'so';
      break;
    case 'spanish':
    case 'spanyol':
    case 'sepanyol':
      code = 'es';
      break;
    case 'sundanese':
    case 'sundan':
    case 'sunda':
      code = 'su';
      break;
    case 'swahili':
    case 'swahili':
      code = 'sw';
      break;
    case 'swedish':
    case 'swedia':
      code = 'sv';
      break;
    case 'tajik':
    case 'tajik':
      code = 'tg';
      break;
    case 'tamil':
    case 'tamil':
      code = 'ta';
      break;
    case 'telugu':
    case 'telugu':
      code = 'te';
      break;
    case 'thai':
    case 'thailand':
    case 'tailand':
    case 'tailan':
    case 'thailan':
      code = 'th';
      break;
    case 'turkish':
    case 'turki':
      code = 'tr';
      break;
    case 'ukrainian':
    case 'ukraina':
      code = 'uk';
      break;
    case 'urdu':
    case 'urdu':
      code = 'ur';
      break;
    case 'uzbek':
    case 'uzbek':
      code = 'uz';
      break;
    case 'vietnamese':
    case 'vietnam':
      code = 'vi';
      break;
    case 'welsh':
    case 'welsh':
      code = 'cy';
      break;
    case 'xhosa':
    case 'xhosa':
      code = 'xh';
      break;
    case 'yiddish':
    case 'yiddish':
      code = 'yi';
      break;
    case 'yoruba':
    case 'yoruba':
      code = 'yo';
      break;
    case 'zulu':
    case 'zulu':
      code = 'zu';
        break;
    default:
      code = 'id';
      break;
  }
  return code;
}

// test("$cuaca kota jakarta");

// function test(kotaInput) {
//   const kota = kotaInput.replace("$cuaca kota", "").trim();
//   const kotaUppercase = kota.charAt(0).toUpperCase() + kota.slice(1);

//   console.log(kotaUppercase);
// }

function weatherr(msg) {
  let kotaSelection = msg.body.replace("$cuaca", "").trim();
  let kota = kotaSelection.charAt(0).toUpperCase() + kotaSelection.slice(1);

  if (kota) {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const date = today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    weather.find({ search: kota, degreeType: 'C' }, function (err, result) {
      if (err) {
        console.error(err);
        if (err) {
          msg.reply("Maaf, terjadi eror...");
        }
      } else {
        translate(`Weather in ${result[0].location.name} on ${dayOfWeek} ${date} is ${result[0].current.skytext} with temperatures ${result[0].current.temperature} degrees ${result[0].location.degreetype}.`, { from: "en", to: "id" })
          .then(res => {
            msg.reply(res);
            console.log(res);
          })
          .catch(err => {
            console.error(err);
            if (err) {
              const regex = /The language '(.*)' is not supported/;
              const match = err.message.match(regex);
              if (match) {
                const unsupportedLanguage = match[1];
                msg.reply(`Maaf, bahasa ${unsupportedLanguage} tidak didukung!`);
              } else {
                console.error(err);
                msg.reply("Terjadi kesalahan, silakan coba lagi.");
              }
            }
          });
      }
    });
  }
}



// function TextToAksaraJawa(text){
//   let AksaraJawa = LatinKeAksara(text);
//   console.log(AksaraJawa)
// }

client.initialize();
