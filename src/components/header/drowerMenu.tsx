// import React, { useState } from 'react';
// import { Drawer, Tabs, List } from 'antd';
// import {
//   UserOutlined,
//   HeartOutlined,
//   RightOutlined,
// } from '@ant-design/icons';
// import "./style.scss"

// const { TabPane } = Tabs;

// const menuItems = [
//   'Home',
//   'Shop',
//   'Raise a Ticket',
//   'Events',
//   'Contact Us',
//   'Certificate Vault Manager',
// ];
// type Props = {
//     open: boolean;
//     setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   };

// const extraItems = [
//   {
//     label: 'Wishlist',
//     icon: <HeartOutlined />,
//   },
//   {
//     label: 'My Account',
//     icon: <UserOutlined />,
//     action: <RightOutlined />,
//   },
// ];



// const CustomDrawerMenu = ({open,setOpen}:Props) => {


//   return (
//     <Drawer
//     placement="left"
//     open={open}
//     onClose={() => setOpen(false)}
//     width={300}
//     bodyStyle={{ padding: 0 }}
//     headerStyle={{ padding: 0 }}
//   >
   
//     <div className="drawer-specific-tabs">
//       <Tabs defaultActiveKey="1" centered className="custom-tabs">
//         <TabPane tab={<span style={{ fontWeight: 600 }}>Menu</span>} key="1">
//           <List
//             dataSource={menuItems}
//             renderItem={(item) => (
//               <List.Item style={{ padding: '12px 24px', fontWeight: 500 }} >
//                 {item}
//               </List.Item>
//             )}
//           />
//           {extraItems.map((item, index) => (
//             <List.Item
//               key={index}
//               style={{
//                 padding: '12px 24px',
//                 fontWeight: 500,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                 {item.icon}
//                 {item.label}
//               </span>
//               {item.action}
//             </List.Item>
//           ))}
//         </TabPane>
//         <TabPane tab="Categories" key="2">
//           <p style={{ padding: '12px 24px' }}>Category list coming soon...</p>
//         </TabPane>
//       </Tabs>
//     </div>
//   </Drawer>
//   );
// };

// export default CustomDrawerMenu;

import React from 'react';
import { Drawer, Tabs, List } from 'antd';
import {
  UserOutlined,
  HeartOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation'; // useRouter from next/navigation for app directory
import './style.scss';
import { useSelector } from 'react-redux';

const { TabPane } = Tabs;

const menuItems = [
  { label: 'Home', path: '/home' },
  { label: 'Shop', path: '/shop' },
  { label: 'Raise a Ticket', path: '/rise_a_ticket' },
  { label: 'Events', path: '/events' },
  { label: 'Contact Us', path: '/contact_us' },
  { label: 'Certificate Vault Manager', path: '/certificate_vault_manager' },
];

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const extraItems = [
  {
    label: 'Wishlist',
    icon: <HeartOutlined />,
    path: '/user/favorites',
  },
  {
    label: 'My Account',
    icon: <UserOutlined />,
    action: <RightOutlined />,
    path: '/user/dashboard',
  },
];

const CustomDrawerMenu = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const pathname = usePathname()
  const Category = useSelector((state: any) => state?.Category?.categries);

  const handleNavigate = (path: string) => {
    router.push(path);
     setOpen(false);
  };

  return (
    <Drawer
      placement="left"
      open={open}
      onClose={() => setOpen(false)}
      width={300}
      styles={{
        body: { padding: 0 },
        header: { padding: 0 }
      }}
    >
      <div className="drawer-specific-tabs">
        <Tabs defaultActiveKey="1" centered className="custom-tabs">
          <TabPane tab={<span style={{ fontWeight: 600 }}>Menu</span>} key="1">
            <List
              dataSource={menuItems}
              renderItem={(item) => (
                <List.Item
                  style={{ padding: '12px 24px', fontWeight: 500, cursor: 'pointer',
                    color:`${pathname?.includes(item.path)?"red":"black"}`
                   }}
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.label}
                </List.Item>
              )}
            />
            {extraItems.map((item, index) => (
              <List.Item
                key={index}
                style={{
                  padding: '12px 24px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                onClick={() => handleNavigate(item.path)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.icon}
                  {item.label}
                </span>
                {item.action}
              </List.Item>
            ))}
          </TabPane>
          <TabPane tab="Categories" key="2">
            {Category.map((item:any, index:any) => (
              <List.Item
                key={index}
                style={{
                  padding: '12px 24px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                className='border-bottom'
                onClick={() => {
                   setOpen(false);
                   router.push(
                    `/category/${item.slug}?id=${window.btoa(item._id)}&type=${encodeURIComponent(item.name)}`
                  );
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.name}
                </span>
              </List.Item>
            ))}
          </TabPane>
        </Tabs>
      </div>
    </Drawer>
  );
};

export default CustomDrawerMenu;

