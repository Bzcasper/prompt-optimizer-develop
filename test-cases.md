### Test Cases for New Evaluation Metrics

Here are the test cases for the new evaluation metrics, designed to validate their implementation.

---

#### 1. SEO Relevance

**Objective:** To verify that the SEO relevance metric correctly assesses the output based on the presence and density of specified keywords.

*   **Test Case 1.1: Primary Keywords Present**
    *   **Input:**
        *   `output_text`: "This text contains keyword1 and keyword2."
        *   `keyword_set`: `{ "primary_keywords": ["keyword1", "keyword2"], "secondary_keywords": [] }`
    *   **Expected Outcome:** High relevance score.

*   **Test Case 1.2: Secondary Keywords Present**
    *   **Input:**
        *   `output_text`: "This text contains keyword3 and keyword4."
        *   `keyword_set`: `{ "primary_keywords": [], "secondary_keywords": ["keyword3", "keyword4"] }`
    *   **Expected Outcome:** Moderate relevance score.

*   **Test Case 1.3: No Keywords Present**
    *   **Input:**
        *   `output_text`: "This text does not contain any of the specified words."
        *   `keyword_set`: `{ "primary_keywords": ["keyword1"], "secondary_keywords": ["keyword2"] }`
    *   **Expected Outcome:** Low to zero relevance score.

*   **Test Case 1.4: Keyword Stuffing**
    *   **Input:**
        *   `output_text`: "keyword1 keyword1 keyword1 keyword1 keyword1"
        *   `keyword_set`: `{ "primary_keywords": ["keyword1"], "secondary_keywords": [] }`
    *   **Expected Outcome:** Low relevance score due to over-optimization.

---

#### 2. Readability

**Objective:** To ensure the readability metric accurately calculates a score based on a standard algorithm (e.g., Flesch Reading Ease).

*   **Test Case 2.1: High Readability**
    *   **Input:** `output_text`: "The cat sat on the mat. The dog chased the cat. The cat ran away." (Simple, short sentences)
    *   **Expected Outcome:** High Flesch Reading Ease score (e.g., > 80).

*   **Test Case 2.2: Low Readability**
    *   **Input:** `output_text`: "The utilization of polysyllabic nomenclature and convoluted sentence structures invariably results in diminished comprehensibility." (Complex words, long sentences)
    *   **Expected Outcome:** Low Flesch Reading Ease score (e.g., < 30).

*   **Test Case 2.3: Target Readability**
    *   **Input:** `output_text`: "This is a sample text with a target readability score of around 60. It has a mix of simple and more complex sentences." (Standard text)
    *   **Expected Outcome:** Flesch Reading Ease score around 60.

---

#### 3. Output Consistency

**Objective:** To validate that the output consistency metric can detect and flag contradictory statements within the generated text.

*   **Test Case 3.1: No Contradictions**
    *   **Input:** `output_text`: "The sky is blue. The ocean is also blue."
    *   **Expected Outcome:** High consistency score (no contradictions found).

*   **Test Case 3.2: Direct Contradiction**
    *   **Input:** `output_text`: "The sky is blue. The sky is not blue."
    *   **Expected Outcome:** Low consistency score (contradiction detected).

*   **Test Case 3.3: Semantic Contradiction**
    *   **Input:** `output_text`: "John is a bachelor. John's wife is a doctor."
    *   **Expected Outcome:** Low consistency score (semantic contradiction detected).

*   **Test Case 3.4: Long-form Consistency**
    *   **Input:** A long article where a fact stated at the beginning is contradicted at the end.
    *   **Expected Outcome:** Low consistency score.

---

#### 4. Cost / Speed

**Objective:** To confirm that the cost/speed metric correctly measures the token count and response time of the generation process.

*   **Test Case 4.1: Within Limits**
    *   **Input:** Generation process that produces 300 tokens in 1500ms.
    *   **Parameters:** `max_tokens`: 500, `max_response_time_ms`: 2000
    *   **Expected Outcome:** High score (within limits).

*   **Test Case 4.2: Exceeds Token Limit**
    *   **Input:** Generation process that produces 600 tokens.
    *   **Parameters:** `max_tokens`: 500
    *   **Expected Outcome:** Low score (exceeds token limit).

*   **Test Case 4.3: Exceeds Time Limit**
    *   **Input:** Generation process that takes 2500ms.
    *   **Parameters:** `max_response_time_ms`: 2000
    *   **Expected Outcome:** Low score (exceeds time limit).

*   **Test Case 4.4: Exceeds Both Limits**
    *   **Input:** Generation process that produces 700 tokens in 3000ms.
    *   **Parameters:** `max_tokens`: 500, `max_response_time_ms`: 2000
    *   **Expected Outcome:** Very low score.
