import { Star, Github, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50 mt-20">
      <div className="container px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary-glow">
                <Star className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                FAME
              </h3>
            </div>
            <p className="text-muted-foreground">
              Your ultimate destination for discovering movies, series, and celebrities across global entertainment industries.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Discover</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="hover:text-primary cursor-pointer transition-colors">Movies</div>
              <div className="hover:text-primary cursor-pointer transition-colors">TV Series</div>
              <div className="hover:text-primary cursor-pointer transition-colors">Celebrities</div>
              <div className="hover:text-primary cursor-pointer transition-colors">News</div>
            </div>
          </div>

          {/* Industries */}
          <div className="space-y-4">
            <h4 className="font-semibold">Industries</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="hover:text-primary cursor-pointer transition-colors">Bollywood</div>
              <div className="hover:text-primary cursor-pointer transition-colors">Hollywood</div>
              <div className="hover:text-primary cursor-pointer transition-colors">K-Drama</div>
              <div className="hover:text-primary cursor-pointer transition-colors">Tollywood</div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="hover:text-primary cursor-pointer transition-colors">Help Center</div>
              <div className="hover:text-primary cursor-pointer transition-colors">Contact Us</div>
              <div className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</div>
              <div className="hover:text-primary cursor-pointer transition-colors">Terms of Service</div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 FAME. All rights reserved. Built with 💜 for entertainment lovers.
          </p>
          <p className="text-muted-foreground text-sm mt-4 md:mt-0">
            Powered by modern web technologies
          </p>
        </div>
      </div>
    </footer>
  );
};