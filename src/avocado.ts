const avocadoArr = [
  "https://media.discordapp.net/attachments/568934729676488706/1250544810864148530/20240612_151713.jpg?ex=66f1cd1c&is=66f07b9c&hm=3d635d01f15e0522b2549b07d96f7c18e087a9bbb3d9d8782e1b170042eddb5c&=&format=webp&width=924&height=1232",
  "https://media.discordapp.net/attachments/756322400890650635/1287570767675916341/20240922_202600.jpg?ex=66f20738&is=66f0b5b8&hm=a3997db24c2f3cdd6efdc18145b06ad095585b342ad7479ba5f298adeede61f0&=&format=webp&width=576&height=1232",
  "https://cdn.discordapp.com/attachments/795860418056159244/1128472098604580995/20230605_113657.jpg?ex=66f1fd8a&is=66f0ac0a&hm=178a7995ee8333bf9908946a6dde17956a53c0987b506f86e5966a840b3624b2&",
];

const avocadoImg = () => avocadoArr[(Math.floor(Math.random() * avocadoArr.length))]

export default avocadoImg;
