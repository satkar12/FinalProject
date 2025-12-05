const FloatingShapes = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Top left shape */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-3xl bg-primary/10 rotate-12 blur-sm" />

            {/* Top right shape */}
            <div className="absolute top-32 -right-16 w-48 h-48 rounded-full bg-primary/8 blur-sm" />

            {/* Bottom left shape */}
            <div className="absolute bottom-40 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-sm" />

            {/* Middle right shape */}
            <div className="absolute top-1/2 right-20 w-32 h-32 rounded-2xl bg-primary/5 rotate-45" />

            {/* Bottom center shape */}
            <div className="absolute -bottom-10 left-1/3 w-56 h-56 rounded-3xl bg-primary/6 -rotate-12 blur-sm" />
        </div>
    );
};

export default FloatingShapes;