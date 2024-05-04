import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-row gap-10">
           <Link to=''><button className="btn p-16 btn-lg btn-accent">Equipment</button></Link>
           <button className="btn p-16 btn-lg btn-accent">Parts</button>
        </div>
    );
};

export default Home;