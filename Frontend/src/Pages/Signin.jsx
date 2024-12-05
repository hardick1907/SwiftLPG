import {Link} from 'react-router-dom';

export default function SignIn () {

return (

<div className="min-h-screen">
    <div className="flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-6xl h-full">
                <div className="w-full flex flex-1 flex-col items-center justify-center p-16">
                    <div className="max-w-md text-center space-y-6">
                        <div className="flex justify-center gap-4 mb-4">
                            <div className="relative">
                                <div className="w-16 h-16 flex items-center justify-center animate-bounce">
                                    <img src="./logo.png" alt="" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold">Welcome to SwiftLPG</h2>
                        <p className="text-base-content/60">
                            Are you a customer or Admin?
                        </p>

                        <div className="flex gap-2 justify-center items-center">
                            <Link to='/customersignup' className="btn btn-primary btn-sm">
                                Customer
                            </Link>
                            
                            <Link to='/adminlogin' className="btn btn-primary btn-sm">
                                Admin
                            </Link>
                        </div>

                    </div>
                </div>
        </div>
    </div>

</div>

)
}