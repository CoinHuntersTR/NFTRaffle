function ShowBuyers({buyer}) {

    let first = buyer.slice(0, 5)
    let last = buyer.slice(-5)
    let playerAddress = first + "..........." + last

    return ( 
        <div>
            <div className="flex flex-row space-x-4">
                <h3>Buyer:</h3>
                <p>{playerAddress}</p>
            </div>
        </div>
     );
}

export default ShowBuyers;