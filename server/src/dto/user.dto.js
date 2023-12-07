class User{
    constructor(params) {
        this["role_id"]=params["role"] || null;
        this["institute_id"]=params["institute"] || null;
        for (const key in params) {
            if(key!=="role"){
                this[`${key}_user`] = params[key];
            }
          }
        }
}

module.exports=User;