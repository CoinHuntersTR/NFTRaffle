import ShowBuyers from "./ShowBuyers";

function Buyers({buyersArray}) {

    return ( 
        <div className="overflow-y-auto h-96 overscroll-contain">
            {buyersArray.map((item, index) => {
                return (
                    <ShowBuyers buyer={item} key={index}/>
                )
            })}
        </div>
     );
}

export default Buyers;