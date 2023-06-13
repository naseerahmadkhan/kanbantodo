import React,{createContext} from "react";

export const data = { email: '' };
export const AppContext = createContext();
export const clearData = () =>{
    for (var item in data){
        if (data.hasOwnProperty(item)){
            delete data[item];
        }
    }
    data.email = ''
}
