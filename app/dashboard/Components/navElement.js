import Image from "next/image";
import Link from "next/link";

const NavElement = (props) => {

    const handler = (e) => {
       
        setDashboard('update dashboard')
       }
    
    return (
        <>  
           <li id="dashoard"  onClick={handler} className=" w-[10rem] mt-2 py-3 pl-4 hover:bg-selectedColor/10  text-[12px]  text-left relative flex items-center">
                <Image className="selectedColor " src={props.sendIcon} width={'15'} height={'15'} alt={''} />
                <Link className="ml-2" href="/"> {props.sendName}</Link>
               { true ?   <span className=" absolute w-1 h-2  bg-[#ff0] right-0 "></span> : '' }
            </li>
        </>
    );
}

export default NavElement;
