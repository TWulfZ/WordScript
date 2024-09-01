import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@components/ui/label";
import { ListIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const Summary = (csvData: string[][]) => {
  const handleBadgeClick = (column: string) => {
    setWildcards((prev) => ({
      ...prev,
      [column]: prev[column] || `{{${column.toUpperCase()}}}`,
    }));
  };

  return (
    <>
      <div className="bg-muted p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <ListIcon className="mr-2 h-5 w-5" />
          Resumen del CSV
        </h3>
        <div className="flex justify-between items-center mb-2">
          <span>
            Número de filas:{" "}
            <Badge variant="secondary">{csvData.length - 1}</Badge>
          </span>
          <span>
            Número de columnas:{" "}
            <Badge variant="secondary">{csvData[0].length}</Badge>
          </span>
        </div>
        <div>
          <span className="font-medium">Columnas:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {csvData[0].map((column, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleBadgeClick(column)}
              >
                {column}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Comodines:</Label>
        {Object.entries(wildcards).map(([column, wildcard]) => (
          <div key={column} className="flex items-center space-x-2">
            <Badge>{column}</Badge>
            <Input
              value={wildcard}
              onChange={(e) => handleWildcardChange(column, e.target.value)}
              className="flex-grow"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Summary;
