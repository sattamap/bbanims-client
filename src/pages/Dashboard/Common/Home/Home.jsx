import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-row gap-10">
           <Link to='/dashboard/equipmentList'><button className="btn p-16 btn-lg btn-accent">Equipment</button></Link>
           <Link to='/dashboard/spareParts'><button className="btn p-16 btn-lg btn-accent">Spare Parts</button></Link>
     
        </div>
    );
};

export default Home;