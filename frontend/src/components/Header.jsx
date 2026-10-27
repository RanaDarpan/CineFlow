import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Logout from "./Logout.jsx"
import Logo from "./Logo.jsx"
import { Link } from "react-router-dom";

export default function Header()
{
    const authStatus = useSelector((state) => (state.auth.isAuthenticated))
    let profile = useSelector((state => state.profile.activeProfile))
    let profile_id = profile?._id
    const {user} = useSelector(state=>state.auth)
    const type = user?.type
    
    const hasProfile = Boolean(profile);
    
    const navigate = useNavigate()
    const location = useLocation()

    const navItems =  [
        {
            name: "Movies",
            url: `/${profile_id}/movies`,
            active: hasProfile,
            show: hasProfile
        },
        {
            name: "Series",
            url: `/${profile_id}/series`,
            active: hasProfile,
            show: hasProfile
        },
        {
          name: "My List",
          url: `/${profile_id}/watchList`,
          active: hasProfile,
          show: hasProfile
        },
        {
          name: "Reviews",
          url: `/${profile_id}/my-reviews`,
          active: hasProfile,
          show: hasProfile 
        },
         {
            name: "Watch History",
            url: `/${profile_id}/watch-history/all`,
            active: hasProfile,
            show: hasProfile
        },
        {
            name:"Genre",
            url: `/${profile_id}/genre`,
            active: type,
            show: type
        },
        {
            name: "Login",
            url: "/login",
            active: !authStatus,
            show: !authStatus
        },
        {
            name: "Signup",
            url: "/signup",
            active: !authStatus,
            show: !authStatus
        },
        {
            name: "Subscription",
            url: "/subscriptions",
            active: hasProfile,
            show: hasProfile
        }
        
    ]

   return (
    <header className='sticky top-0 z-50 w-full border-b border-neutral-900 bg-[#0a0a0a]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#0a0a0a]/60 transition-all'>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className='flex items-center gap-8'>
            <Link to='/' className="flex-shrink-0">
              <Logo width='auto' />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className='hidden md:flex gap-6'>
                {navItems.map((item) => 
                item.show ? (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.url)}
                    className={`text-sm font-medium transition-colors hover:text-white ${
                        location.pathname.includes(item.url) && item.url !== "/" 
                        ? 'text-white' 
                        : 'text-neutral-400'
                    }`}
                  >
                    {item.name}
                  </button>
                ) : null
                )}
            </nav>
          </div>

          <div className='flex items-center gap-4'>
            {authStatus && (
                <div className="flex items-center gap-4">
                   <Logout />
                </div>
            )}
          </div>
        </div>
    </header>
  )
}