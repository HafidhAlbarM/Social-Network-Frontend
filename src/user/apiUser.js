export const read = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        //console.log(response)//data response asli, bukan json
        //.json() utk membuat reponse jadi json
        return response.json();
    })
    .catch(err => console.log(err))
}

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}