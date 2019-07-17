// const Permissions = require("./Permissions");
const initFilters = require("./init");
const errorFilters = require("./error");

module.exports = (koa)=>{
  koa.use(initFilters());
  koa.use(errorFilters());
}