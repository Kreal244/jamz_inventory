import { HeaderProps } from "@/types/components";

const Header = ({ children, className = "", style = {} }: HeaderProps) => {
    return (
        <div id="header" className={`bg-sub-background ${className}`} style={style}>
            {children}
        </div>
    );
};
export default Header;
