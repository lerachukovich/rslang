const MathHelper = {
  getRandomNumber: function(min, max){
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  },
  shuffleArray: function (array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
    return array;
  }
};

export default MathHelper;
