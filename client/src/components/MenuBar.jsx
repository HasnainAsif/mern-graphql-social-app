import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { AuthContext } from '../util/context/auth';

// dusty green color

const MenuBar = () => {
  const context = useContext(AuthContext);

  const location = useLocation();
  const pathname = location.pathname.substring(1);

  const [activeItem, setActiveItem] = useState(pathname || 'home');

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const menuBar = context.user ? (
    <Menu pointing secondary size='massive' color='teal' className='main-menu'>
      <Menu.Item name={context.user.username} active as={Link} to='/' />
      <Menu.Menu position='right'>
        <Menu.Item name='logout' onClick={context.logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size='massive' color='teal' className='main-menu'>
      <Menu.Item
        name='home'
        active={activeItem === 'home'}
        as={Link}
        to='/'
        onClick={handleItemClick}
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          as={Link}
          to='/login'
          onClick={handleItemClick}
        />
        <Menu.Item
          name='register'
          active={activeItem === 'register'}
          as={Link}
          to='/register'
          onClick={handleItemClick}
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
};

export default MenuBar;
