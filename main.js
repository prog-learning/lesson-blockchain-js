/* ハッシュ化とか暗号化とかいろいろできるライブラリ */
const crypto = require('crypto-js');

/* 文字列をハッシュ化する関数を先に定義 */
const toHash = (str) => {
  const hash = crypto.SHA256(str); // 文字列をハッシュ化
  return hash.toString();
  // 同じ文字列を使ってハッシュ化した場合は必ず同じ値になる
};

console.log(toHash('hello')); // 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
console.log(toHash('hello!')); // ce06092fb948d9ffac7d1a376e404b26b7575bcc11ee05a4615fef4fec3a308b

/* Block */
const firstBlock = {
  index: 0, // ブロック番号
  timestamp: new Date(), // 時刻
  data: '世界最古のブロック', // ブロックに追加するデータ
  previousHash: '0', // 前のブロックのハッシュ
  hash: toHash(0 + '世界最古のブロック' + 0), // ブロックのハッシュ
  nonce: 0, // nonce
};

/* Block Chain */
const blockChain = {
  chain: [firstBlock], // ブロックチェーン（台帳）
  transaction: ['2代目ブロック', '3代目ブロック', '4代目JSONSブラザーズ'], // 保存待ちのデータたち
};

/* Block Chain に Block を追加する処理 */
const addBlock = () => {
  if (blockChain.transaction.length === 0) return; // 待ちのデータがなければ何もしない
  const previousHash = blockChain.chain[blockChain.chain.length - 1].hash; // 前のブロックのハッシュ
  const data = blockChain.transaction[0]; // 現在のブロックに追加する待ちのデータ

  /* nonceを見つける処理（POW） */
  const { nonce, hash } = proofOfWork(previousHash, data, 4);
  console.log(nonce);

  /* 追加されるBlock */
  const newBlock = {
    index: blockChain.chain.length,
    timestamp: new Date(),
    data,
    previousHash,
    hash,
    nonce, // nonceを保存しないというのもありかも
  };

  blockChain.chain.push(newBlock);
  blockChain.transaction.shift(); // 待ちのデータを削除
};

/* POW...条件が成立するnonceを見つける */
const proofOfWork = (previousHash, data, difficulty) => {
  /**
   * 条件）
   * ハッシュ化された値に左から0がdifficulty値の個数以上並ぶ
   */
  let nonce = 0;
  let hash = toHash(previousHash + data + nonce); // dataは文字列でない場合はJSON.stringify()する
  while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
    console.log(hash);
    nonce++;
    hash = toHash(previousHash + data + nonce);
  }
  console.log('POW nonce: ', hash);
  return { nonce, hash };
};

/* Block Chain をチェックする */
const checkChain = () => {
  for (let i = 1; i < blockChain.chain.length; i++) {
    const currentBlock = blockChain.chain[i];
    const previousBlock = blockChain.chain[i - 1];
    if (
      currentBlock.hash !==
      toHash(previousBlock.hash + currentBlock.data + currentBlock.nonce)
    ) {
      console.log('⚠️ブロックチェーンが壊れています');
      return;
    }
  }
  console.log('ブロックチェーンは壊れていません👷✨');
};

while (blockChain.transaction.length > 0) {
  addBlock();
  console.log(blockChain);
}
checkChain();
