import * as React from 'react';

export interface TreeNode {
  id: string;
  label: string;
  subsets: Array<TreeNode>;
  filteredSubsets: Array<TreeNode>;
}

const TreeSelectionBox: React.FC<any> = ({nodes, value, onChange}) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [filter, setFilter] = React.useState<string>("");
  const [filteredNodes, setFilteredNodes] = React.useState<Array<TreeNode>>([]);
  const [isDropDownOpen, setIsDropDownOpen] = React.useState<boolean>(false);
  const [isValueSelected, setValueSelected] = React.useState<boolean>(value !== undefined);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilter(value);
    setFilteredNodes(filterNodes(nodes, value));
    setIsDropDownOpen(true);
  };

  const filterNodes = (nodes: Array<TreeNode>, filter: string): Array<TreeNode> => {
    console.log(filter);
    const items: Array<TreeNode> = [];
    nodes.forEach(node => {
      node.filteredSubsets = node.subsets ? filterNodes(node.subsets, filter) : [];
      if (node.label.includes(filter) || node.filteredSubsets.length > 0) {
        items.push(node);
      }
    })
    return items;
  };

  const handleBlur = (): void => {
    setTimeout(() => {
      if (dropdownRef.current && !dropdownRef.current.contains(document.activeElement)) {
        setIsDropDownOpen(false);
      }
    }, 0);
  };

  const currentText = !isDropDownOpen && isValueSelected ? value : filter;

  const renderSubNodes = (nodes:any) => {
    return (
      <ul className="dropdown-content p-1 w-60">
        {nodes.map((node: TreeNode) => (
            (<li className="pl-6" key={node.label}>
                { node.filteredSubsets && node.filteredSubsets.length > 0 ? 
                    (<details><summary>{node.label}</summary>{ renderSubNodes(node.filteredSubsets) }</details>) :
                    (<span>{node.label}</span>)
                }
              </li>)
            ))
        }
      </ul>
    );
  }

  return (
    <div className="relative" onBlur={handleBlur}>
      {/* Textbox that displays value, allows filter */}
      <input type="text" value={currentText} onChange={handleSearch}
          onFocus={() => setIsDropDownOpen(true)}
          placeholder="Search..." className="input input-bordered w-80 m-1"></input>

      {/* Dropdown with tree */}
      { isDropDownOpen && <div className="absolute border bg-white shadow rounded w-80 m-1 z-10" ref={dropdownRef}>
          {renderSubNodes(filteredNodes)}
      </div> }
    </div>
  );
};

export { TreeSelectionBox };
