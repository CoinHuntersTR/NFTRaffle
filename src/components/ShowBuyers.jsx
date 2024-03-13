function ShowBuyers({buyer}) {

    return ( 
        <div>
            <div className="flex flex-row space-x-4">
                <h3>Buyer:</h3>
                <p>{buyer}</p>
            </div>
        </div>
     );
}

export default ShowBuyers;