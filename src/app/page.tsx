import Composer from "@/components/composer";
import { Editor } from "@/components/editor";

const HomePage = () => (
  <>
    <header className="container">
      <h1>Pixly</h1>
      <p>Free and open tools for effortless pixel assets creation.</p>
    </header>
    <main>
      <Composer />
      <Editor />
    </main>
  </>
);

export default HomePage;
