
import { NextResponse ,NextRequest} from 'next/server';


export function middleware(request: NextRequest) {
  
  const path = request.nextUrl.pathname; 
    
  const isPublicPath =path=== '/login' || path==="/sign-up" || path==='/verify-user'
  
  const token = request.cookies.get('token'); 
  

  if(isPublicPath&&token){
     return NextResponse.redirect(new URL('/projects', request.url));
  }
  
  if(!isPublicPath&&!token){
    return NextResponse.redirect(new URL('/login', request.url));
 }
 


  return NextResponse.next();
}

export const config = {
  matcher: [

    '/projects',
     '/dashboard',
     '/login',
     '/sign-up',
     "/verify-user"
  ], 
};
