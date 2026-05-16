import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import InputField from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { FaqItem, getFaq, updateFaq } from "../../services/settings.service";

const FAQ_ITEM_MAX_LENGTH = 500;

type LocalFaqItem = {
  question: string;
  answer: string;
};

const emptyItem = (): LocalFaqItem => ({ question: "", answer: "" });

export default function FaqPage() {
  const [items, setItems] = useState<LocalFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const faq = await getFaq();
        if (cancelled) return;
        setItems(
          faq.length
            ? faq.map((item) => ({
                question: item.question ?? "",
                answer: item.answer ?? "",
              }))
            : [emptyItem()]
        );
      } catch (err) {
        console.error("Failed to fetch faq:", err);
        if (!cancelled) setError("Failed to load FAQ content.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setItem = (
    index: number,
    key: keyof LocalFaqItem,
    value: string
  ): void => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const moveItem = (index: number, direction: -1 | 1): void => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const addItem = (): void => {
    setItems((prev) => [...prev, emptyItem()]);
  };

  const removeItem = (index: number): void => {
    setItems((prev) => {
      if (prev.length === 1) return [emptyItem()];
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const normalized = items
      .map((item, index) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
        sortOrder: index,
      }))
      .filter((item) => item.question || item.answer);

    for (let i = 0; i < normalized.length; i += 1) {
      if (!normalized[i].question || !normalized[i].answer) {
        setError("Each FAQ item must include both question and answer.");
        return;
      }
      if (
        normalized[i].question.length > FAQ_ITEM_MAX_LENGTH ||
        normalized[i].answer.length > FAQ_ITEM_MAX_LENGTH
      ) {
        setError(`Question and answer max length is ${FAQ_ITEM_MAX_LENGTH}.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const saved = await updateFaq(normalized as FaqItem[]);
      setItems(
        saved.length
          ? saved.map((item) => ({
              question: item.question ?? "",
              answer: item.answer ?? "",
            }))
          : [emptyItem()]
      );
      setSuccess("FAQ content updated successfully.");
    } catch (err) {
      console.error("Failed to update faq:", err);
      setError("Failed to update FAQ content.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="FAQ | Snack Admin" description="Manage mobile FAQ entries." />
      <PageBreadcrumb pageTitle="FAQ" />
      <div className="space-y-6">
        <ComponentCard title="Frequently asked questions">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              )}

              {items.map((item, index) => (
                <div
                  key={`faq-item-${index}`}
                  className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <InputField
                    placeholder={`Question ${index + 1}`}
                    value={item.question}
                    onChange={(e) => setItem(index, "question", e.target.value)}
                    disabled={submitting}
                  />
                  <TextArea
                    rows={4}
                    placeholder="Answer"
                    value={item.answer}
                    onChange={(value) => setItem(index, "answer", value)}
                    disabled={submitting}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={submitting || index === 0}
                      onClick={() => moveItem(index, -1)}
                    >
                      Move up
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={submitting || index === items.length - 1}
                      onClick={() => moveItem(index, 1)}
                    >
                      Move down
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={submitting}
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  onClick={addItem}
                >
                  Add FAQ item
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save FAQ"}
                </Button>
              </div>
            </form>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
