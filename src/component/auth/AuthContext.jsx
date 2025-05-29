// import { Link } from 'react-router-dom';

// const Header = () => {
//   // For demo purposes - in a real app you would get this from your auth system
//   const isAdmin = true; // Set to false to see regular user header

//   return (
//     <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
//       <nav className="container mx-auto px-6 h-full flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
//           JobPortal
//         </Link>
        
//         <div className="flex items-center space-x-6">
//           {isAdmin && (
//             <Link 
//               to="/admin"
//               className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
//             >
//               Admin Panel
//             </Link>
//           )}
          
//           <Link 
//             to="/jobs" 
//             className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
//           >
//             Browse Jobs
//           </Link>
          
//           <Link 
//             to="/login" 
//             className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-blue-50"
//           >
//             Login
//           </Link>
          
//           <Link 
//             to="/signup" 
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
//           >
//             Sign Up
//           </Link>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;