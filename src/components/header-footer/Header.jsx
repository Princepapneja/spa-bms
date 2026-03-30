import { Bell } from 'lucide-react'
import React from 'react'
import { NavLink, useNavigate } from 'react-router'

const Header = () => {
  const menu = [
    { name: "Home", url: "/" },
    { name: "Therapists", url: "/therapists" },
    { name: "Sales", url: "/sales" },
    { name: "Clients", url: "/clients" },
    { name: "Transactions", url: "/transactions" },
    { name: "Reports", url: "/reports" },
  ]
  const navigate= useNavigate()
const handleLogout= ()=>{
navigate("/")
}
  return (
    <header className='p-2 bg-primary'>
      <div className='flex justify-between gap-2 items-center'>
        
        <h2 className='text-white font-bold text-3xl'>Logo</h2>

        <div className='flex gap-4 items-center'>

          <nav className='flex gap-2'>
            {menu.map((e) => (
              <NavLink
                key={e.url}
                to={e.url}
                className={({ isActive }) =>
                  `p-2 font-bold transition-colors
                   ${isActive 
                      ? "text-secondary" 
                      : "text-primary-foreground hover:text-secondary"}`
                }
              >
                {e.name}
              </NavLink>
            ))}
          </nav>

          <Bell color='#fff' />
          <button onClick={handleLogout} className='text-white'>Logout</button>

        </div>
      </div>
    </header>
  )
}
export default Header 