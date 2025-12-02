from typing import Dict, List, Any
from database.connection import query_db
from models.schemas import GraphNode, GraphEdge
import math

class GraphBuilder:
    """Knowledge graph construction engine"""

    def build_graph(
        self,
        user_attributes: Dict[str, Any],
        eligible_scheme_ids: List[str] = None
    ) -> Dict[str, List]:
        """
        Build knowledge graph with nodes and edges

        Returns: {nodes: [...], edges: [...]}
        """
        nodes = []
        edges = []

        # User node (center)
        nodes.append(GraphNode(
            id="user",
            type="user",
            label="You",
            data={"name": "You"},
            position={"x": 0, "y": 0}
        ))

        # Attribute nodes (surrounding user)
        attr_positions = self._circular_layout(len(user_attributes), radius=150)
        for i, (attr_key, attr_value) in enumerate(user_attributes.items()):
            if attr_value is not None:
                attr_id = f"attr_{attr_key}"
                nodes.append(GraphNode(
                    id=attr_id,
                    type="attribute",
                    label=f"{attr_key}: {attr_value}",
                    data={"attribute": attr_key, "value": attr_value},
                    position=attr_positions[i]
                ))

                # Edge from user to attribute
                edges.append(GraphEdge(
                    source="user",
                    target=attr_id,
                    type="has_attribute",
                    label=""
                ))

        # Scheme nodes (outer ring)
        if eligible_scheme_ids:
            placeholders = ','.join('?' * len(eligible_scheme_ids))
            query = f"SELECT * FROM schemes WHERE id IN ({placeholders})"
            schemes = query_db(query, tuple(eligible_scheme_ids))

            scheme_positions = self._circular_layout(len(schemes), radius=300)
            for i, scheme in enumerate(schemes):
                scheme_id = scheme['id']
                nodes.append(GraphNode(
                    id=scheme_id,
                    type="scheme",
                    label=scheme['name'],
                    data={
                        "name": scheme['name'],
                        "benefit_value": scheme['benefit_value'],
                        "icon": scheme['icon']
                    },
                    position=scheme_positions[i]
                ))

                # Edges from attributes to schemes (eligibility paths)
                rules_query = "SELECT * FROM scheme_rules WHERE scheme_id = ?"
                rules = query_db(rules_query, (scheme_id,))

                for rule in rules:
                    attr_id = f"attr_{rule['attribute']}"
                    # Only add edge if attribute exists in user's attributes
                    if rule['attribute'] in user_attributes:
                        edges.append(GraphEdge(
                            source=attr_id,
                            target=scheme_id,
                            type="qualifies_for",
                            label="qualifies" if rule['is_hard_constraint'] else "likely"
                        ))

            # Add conflict edges between schemes
            conflict_query = """
                SELECT scheme_id_1, scheme_id_2
                FROM scheme_relations
                WHERE relation_type = 'conflicts'
                AND scheme_id_1 IN ({}) AND scheme_id_2 IN ({})
            """.format(placeholders, placeholders)
            conflicts = query_db(
                conflict_query,
                tuple(eligible_scheme_ids) + tuple(eligible_scheme_ids)
            )

            for conflict in conflicts:
                edges.append(GraphEdge(
                    source=conflict['scheme_id_1'],
                    target=conflict['scheme_id_2'],
                    type="conflicts_with",
                    label="conflicts"
                ))

        return {
            'nodes': nodes,
            'edges': edges
        }

    def _circular_layout(self, count: int, radius: int) -> List[Dict[str, float]]:
        """Generate circular layout positions"""
        positions = []
        for i in range(count):
            angle = (2 * math.pi * i) / count
            x = radius * math.cos(angle)
            y = radius * math.sin(angle)
            positions.append({"x": x, "y": y})
        return positions
