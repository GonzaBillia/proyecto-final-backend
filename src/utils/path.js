import Path from 'path'

const path = {
    root: Path.dirname(""),
    src: Path.join(Path.dirname(""), "src"),
    public: Path.join(Path.dirname(""),"src", "public"),
    views: Path.join(Path.dirname(""),"src", "views"),
}

export default path