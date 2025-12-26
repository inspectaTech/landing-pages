
const { signGuestToken } = require("../signToken");
const arg = require('arg');
const { is_live } = require("../is_local");


// [How To Write Your First Node.js Script](https://devdojo.com/bo-iliev/how-to-write-your-first-nodejs-script)   
// console.log(`[alert-token] process.argv`, process.argv);

function parseArgumentsToOptions(rawArgs){
  const args = arg(
    {
      "--email":String,
      "--id":String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    email: args['--email'] || false,
    user_id: args['--id'] || false,
    user: args._[0] || false,
  };
}

(async () => { 
  try {
    // only run on localhost
    if(is_live(true)) return;
    
    if(0) console.log(`[alert-token] args`, process.argv);
    let options = parseArgumentsToOptions(process.argv);
    if(1) console.log(`[alert-token] options`, options);

    let {
      user,
      user_id,
      email,
    } = options;
    
    if(!user && !user_id) throw "requires user id";
    
    let use_id = user ? user : user_id;

    if(1) console.log(`[alert-token] typeof email`, typeof email);
    let [at, jwt_data] = await signGuestToken({sponsor: {_id: use_id}, client: use_id, email, expires: true, action: "alert", /*test: true, payload*/});
    
    if(1) console.log(`[alert-token] alert`, at);
    if(1) console.log(`[alert-token] alert`, jwt_data);
      
  } catch (error) {
    console.log(`[alert-token][alert] an error occured`, error);
  }
})()