export const signup = user => {
    return fetch("http://localhost:8081/user", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err));
}

export const signin = user => {
    return fetch("http://localhost:8081/user/signin", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err));
}

export const authenticate = (jwt, next) => {
    //window utk cek apakah ada objek window utk nantinya akses localStorage
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt", JSON.stringify(jwt))
        next();
    }
}

export const isAuthenticated = () => {
    if(typeof window == "undefined"){
        return false;
    }

    if(localStorage.getItem("jwt")){
        return JSON.parse(localStorage.getItem("jwt"));
    }else{
        return false;
    }
}

export const signout = (next) => {
    //window utk cek apakah ada objek window utk nantinya akses localStorage
    if(typeof window !== "undefined") localStorage.removeItem("jwt");
    next();
    return fetch("http://localhost:8081/user/signout", {
        method: "GET"
    })
    .then(response => {
        console.log(response);
    })
    .catch(err => console.log(err));
}