import { useNavigate } from 'react-router-dom';

export function CustomerPortalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        {/* Logo/Brand Header */}
        <div className="flex items-center gap-3 mb-12 w-full justify-center">
          <div className="w-10 h-10 bg-primary rounded-[10px] flex items-center justify-center text-white shadow-sm">
            <div className="w-4 h-4 bg-card rounded-sm"></div>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Portal</span>
        </div>

        {/* Main Card */}
        <div className="bg-card rounded-[2rem] shadow-lg border border-border p-12 md:p-20 text-center w-full transition-colors duration-400 ease-in-out">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Hello, Guest
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed font-light">
            Welcome to your Customer Portal. You can manage your account and billing here. 
            If you need assistance, try our new floating support chat in the corner.
          </p>

          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-light transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            Sign in to Portal
          </button>
        </div>

      </div>
    </div>
  );
}
