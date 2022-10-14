import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import sendAsync from "../services/test";

const IndexPage = () => {
  const [message, setMessage] = useState("SELECT * FROM names");
  const [response, setResponse] = useState();

  const send = (sql: string) => {
    sendAsync(sql).then((result) => setResponse(result));
  };

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <article>
        <p>Send a query command to db</p>
        <input
          type="text"
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
        />
        <button type="button" onClick={() => send(message)}>
          Send
        </button>
        <br />
        <p>Main process responses:</p>
        <br />
        <pre>
          {(response && JSON.stringify(response, null, 2)) ||
            "No query results yet!"}
        </pre>
      </article>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </Layout>
  );
};

export default IndexPage;
