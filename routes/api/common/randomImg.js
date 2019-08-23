

async function random_img(ctx) {

  


  ctx.body = {
    code: "0000",
    msg: '',
  };
}

module.exports = {
  "GET /api/common/random_img": random_img,
}