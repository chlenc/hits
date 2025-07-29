import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { githubService } from "../services/githubService";
import PageContainer from "../components/PageContainer";
import Loading from "../components/Loading";

// Styled wrapper for ReactMarkdown
const ReactMarkdownWrapper = styled.div`
  color: #fff;
  font-family: "Instrument Sans", Arial, sans-serif;
  line-height: 1.6;

  h1 {
    font-family: "Instrument Serif", Georgia, serif;
    font-size: 48px;
    font-style: normal;
    font-weight: 400;
    line-height: 105%; /* 50.4px */
    letter-spacing: -0.96px;
  }

  h2 {
    font-family: "Instrument Serif", Georgia, serif;
    font-size: 34px;
    font-style: normal;
    font-weight: 400;
    line-height: 105%; /* 35.7px */
    letter-spacing: -0.34px;
  }

  h3 {
    font-family: "Instrument Serif", Georgia, serif;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 26.4px */
  }

  p {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 22.4px */
    letter-spacing: -0.16px;
  }

  strong {
    font-weight: 600;
    /* color: #e478fe; */
  }

  em {
    font-style: italic;
    color: #888;
  }

  ul {
    margin: 16px 0;
    padding-left: 24px;
  }

  li {
    font-size: 16px;
    color: #fff;
    margin: 8px 0;
    line-height: 1.6;
  }

  a {
    color: #19f096;
    text-decoration: underline;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #70ec9e;
  }

  blockquote {
    border-left: 4px solid #19f096;
    margin: 16px 0;
    padding-left: 16px;
    font-style: italic;
    color: #888;
  }

  code {
    background: #2b2a2a;
    color: #19f096;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: "Courier New", monospace;
    font-size: 14px;
  }

  pre {
    background: #2b2a2a;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
  }

  pre code {
    background: none;
    padding: 0;
    color: #fff;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
  }

  th,
  td {
    border: 1px solid #2b2a2a;
    padding: 12px;
    text-align: left;
    font-size: 14px;
  }

  th {
    background: #2b2a2a;
    color: #fff;
    font-weight: 600;
  }

  td {
    color: #fff;
  }

  hr {
    border: none;
    border-top: 1px solid #2b2a2a;
    margin: 24px 0;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #fff;
`;

const ErrorMessage = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
  color: #ff6b6b;
`;

const RetryButton = styled.button`
  background: #19f096;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #70ec9e;
  }
`;

const About: React.FC = () => {
  const [whitepaperContent, setWhitepaperContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWhitepaper = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const content = await githubService.getWhitepaper();
      setWhitepaperContent(content);
    } catch (err) {
      console.error("Failed to load whitepaper:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load whitepaper"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWhitepaper();
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Loading />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={loadWhitepaper}>Retry</RetryButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ReactMarkdownWrapper>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {whitepaperContent}
        </ReactMarkdown>
      </ReactMarkdownWrapper>
    </PageContainer>
  );
};

export default About;
