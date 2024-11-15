import type { Config } from "tailwindcss";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {

      keyframes: {
        "caret-blink": {
          "0%, 70%, 100%": { 
            opacity: "1", 
            backgroundColor: "#673df5"  
          },
          "20%, 50%": { 
            opacity: "0", 
            backgroundColor: "#673df5"  
          },
        },
      },
      
      animation: {
        "caret-blink": "caret-blink 1s ease-out infinite"
      },
  		colors: {
        ring: {
          custom: '#673df5', 
        },
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
			
  			'custom-purple': '#412C89',
			  'custom-purple-light': '#7F60FF', 
			  'custom-dark': '#0D0C1F',
			  'custom-bg': '#1E1F2B',


  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  		
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			input: '0px 4px 6px -2px rgba(65, 44, 131, 0.1), 0px 2px 4px 0px rgba(65, 44, 131, 0.08), 0px 0px 0px 2px rgba(65, 44, 131, 0.2)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [addVariablesForColors, require("tailwindcss-animate")],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
export default config;


